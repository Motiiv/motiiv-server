const { User, Video, Workspace } = require("../models");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { LogoScrape } = require("logo-scrape");

module.exports = {
  createWorkspace: async (req, res) => {
    const { id: userId } = req.user;
    const { name, url } = req.body;
    let hostname;
    try {
      hostname = new URL(url).hostname;
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.INVALID_URL));
    }
    const { url: logoUrl } = await LogoScrape.getLogo(hostname);
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(
              statusCode.NOT_FOUND,
              responseMessage.GET_ONE_USER_SUCCESS,
            ),
          );
      }
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
        attributes: ["id", "name", "url", "logoUrl", "UserId"],
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

  getWorkspace: async (req, res) => {
    const { id: UserId } = req.user;
    const { workspaceId } = req.params;
    try {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId, UserId },
        attributes: ["id", "name", "url", "logoUrl", "UserId"],
      });
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
    const { id: UserId } = req.user;
    const { workspaceId } = req.params;
    const { newName, newUrl } = req.body;
    let hostname;
    try {
      hostname = new URL(newUrl).hostname;
    } catch (error) {
      console.log(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.INVALID_URL));
    }
    const { url: logoUrl } = await LogoScrape.getLogo(hostname);

    if (!newName || !newUrl) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.success(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId, UserId },
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
      workspace.name = newName;
      workspace.url = newUrl;
      if (logoUrl){
        workspace.logoUrl = logoUrl
      }
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

    if (!UserId) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.LOGIN_REQUIRED),
        );
    }
    try {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId, UserId },
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
