const { User, Video, Workspace } = require("../models");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { LogoScrape } = require("logo-scrape");
const axios = require("axios");

module.exports = {
  createWorkspace: async (req, res) => {
    const { user } = req;
    const { name, url } = req.body;
    if (!name || !url) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    let logoUrl;
    try {
      const hostname = new URL(url).hostname;
      const { url: tempUrl } = await LogoScrape.getLogo(hostname);
      logoUrl = tempUrl;
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.INVALID_URL));
    }
    try {
      const workspace = await Workspace.create({ name, url });
      if (logoUrl) {
        workspace.logoUrl = logoUrl;
        await workspace.save();
      }
      await user.addWorkspace(workspace);
      const { createdAt, updatedAt, ...workspaceData } = workspace.dataValues;
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_WORKSPACE_SUCCESS,
            workspaceData,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },

  getAllWorkspaces: async (req, res) => {
    const { id: UserId } = req.user;
    try {
      const workspaces = await Workspace.findAll({
        where: { UserId },
        attributes: ["id", "name", "url", "logoUrl"],
      });
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ALL_WORKSPACES_SUCCESS,
            workspaces,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },

  getOneWorkspace: async (req, res) => {
    const { id: UserId } = req.user;
    const { workspaceId } = req.params;
    try {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId, UserId },
        attributes: ["id", "name", "url", "logoUrl"],
      });
      if (!workspace) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(
              statusCode.NOT_FOUND,
              responseMessage.GET_ONE_WORKSPACE_FAIL,
            ),
          );
      }
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ONE_WORKSPACE_SUCCESS,
            workspace,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },

  updateWorkspace: async (req, res) => {
    const defaultWorkspaceLogoUrl =
      "https://sopt-27-wooyeong.s3.ap-northeast-2.amazonaws.com/motiiv/user/workspace/favicon_new.png";
    const { id: UserId } = req.user;
    const { workspaceId } = req.params;
    const { newName, newUrl } = req.body;
    let newLogoUrl;

    if (newUrl) {
      try {
        new URL(newUrl).hostname;
      } catch (error) {
        console.log(error);
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.INVALID_URL));
      }
      const urlData = await LogoScrape.getLogo(newUrl);
      if (urlData) {
        try {
          await axios({
            method: "GET",
            url: urlData.url,
          });
          newLogoUrl = urlData.url;
        } catch (error) {
          console.log(error);
          newLogoUrl = defaultWorkspaceLogoUrl;
        }
      }
    }

    try {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId, UserId },
        attributes: { exclude: ["UserId"] },
      });
      if (!workspace) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(
              statusCode.NOT_FOUND,
              responseMessage.GET_ONE_WORKSPACE_FAIL,
            ),
          );
      }
      workspace.name = newName || workspace.name;
      workspace.url = newUrl || workspace.url;
      workspace.logoUrl = newLogoUrl || defaultWorkspaceLogoUrl;
      await workspace.save();
      const { createdAt, updatedAt, ...workspaceData } = workspace.dataValues;
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.UPDATE_WORKSPACE_SUCCESS,
            workspaceData,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },

  deleteWorkspace: async (req, res) => {
    const { id: UserId } = req.user;
    const { workspaceId } = req.params;
    try {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId, UserId },
        attributes: { exclude: ["UserId"] },
      });
      if (!workspace) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(
              statusCode.NOT_FOUND,
              responseMessage.GET_ONE_WORKSPACE_FAIL,
            ),
          );
      }
      const {
        createdAt,
        updatedAt,
        ...deletedWorkspace
      } = workspace.dataValues;
      await workspace.destroy();
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.DELETE_WORKSPACE_SUCCESS,
            { deletedWorkspace },
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },
};
