import { User, App, Provider, Key } from "@app/lib/models";
import { Op } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";
import { auth_api_user } from "@app/lib/api/auth";

const { DUST_API } = process.env;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let [authRes, appOwner] = await Promise.all([
    auth_api_user(req),
    User.findOne({
      where: {
        username: req.query.user,
      },
    }),
  ]);

  if (authRes.isErr()) {
    const err = authRes.error();
    return res.status(err.status_code).json(err.error);
  }
  const authUser = authRes.value();

  if (!appOwner) {
    res.status(404).json({
      error: {
        type: "user_not_found",
        message: "The user you're trying to query was not found.",
      },
    });
    return;
  }
  if (authUser.id != appOwner.id) {
    res.status(401).json({
      error: {
        type: "app_user_mismatch_error",
        message:
          "Only apps that you own can be interacted with by API \
          (you can clone this app to run it).",
      },
    });
    return;
  }

  const readOnly = authUser.id !== appOwner.id;

  let app = await App.findOne({
    where: readOnly
      ? {
          userId: authUser.id,
          sId: req.query.sId,
          visibility: {
            [Op.or]: ["public", "unlisted"],
          },
        }
      : {
          userId: authUser.id,
          sId: req.query.sId,
        },
  });

  if (!app) {
    res.status(404).json({
      error: {
        type: "app_not_found",
        message: "The app whose run you're trying to retrieve was not found.",
      },
    });
    return;
  }

  switch (req.method) {
    case "GET":
      let runId = req.query.runId;

      console.log("[API] app run retrieve:", {
        user: appOwner.username,
        app: app.sId,
        runId,
      });

      const runRes = await fetch(
        `${DUST_API}/projects/${app.dustAPIProjectId}/runs/${runId}`,
        {
          method: "GET",
        }
      );

      if (!runRes.ok) {
        const error = await runRes.json();
        res.status(400).json({
          error: {
            type: "run_error",
            message: "There was an error retrieving the run.",
            run_error: error.error,
          },
        });
        break;
      }

      let run = (await runRes.json()).response.run;
      run.specification_hash = run.app_hash;
      delete run.app_hash;

      if (run.status.run === "succeeded" && run.traces.length > 0) {
        run.results = run.traces[run.traces.length - 1][1];
      } else {
        run.results = null;
      }

      res.status(200).json({ run });
      break;

    default:
      res.status(405).json({
        error: {
          type: "method_not_supported_error",
          message: "The method passed is not supported, GET is expected.",
        },
      });
      break;
  }
}
