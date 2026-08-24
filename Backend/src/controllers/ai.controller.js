import userModel from "../models/user.model.js";
import aiChatModel from "../models/ai.model.js";
import * as ai from "../services/ai.service.js";

import { getGoals } from "../controllers/goals.controller.js";
import { getAllProgress } from "../controllers/progress.controller.js";
import { getGfgCodingData } from "../services/gfg.service.js";

const mockRes = () => {
  const res = {};
  res.status = () => res;
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

export async function giveResponse(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const userProfile = await userModel
      .findById(req.userId)
      .select(
        "username targetRole collegeName currentYear leetcodeName gfgName",
      );

    const mockReq = { userId: req.userId };

    const goalsRes = mockRes();
    await getGoals(mockReq, goalsRes);
    const goals = goalsRes.data?.goals || [];

    const progressRes = mockRes();
    await getAllProgress(mockReq, progressRes);
    const progressData = progressRes.data?.data || {};

    let gfgSummary = null;
    if (userProfile.gfgName) {
      try {
        const rawGfgData = await getGfgCodingData(userProfile.gfgName);
        gfgSummary = {
          codingScore: rawGfgData.codingScore,
          monthlyScore: rawGfgData.monthlyScore,
          totalProblemsSolved: rawGfgData.totalProblemsSolved,
          potdSolvedCount: rawGfgData.potdSolvedCount,
          currentStreak: rawGfgData.currentStreak,
          longestStreak: rawGfgData.longestStreak,
          difficultyBreakdown: rawGfgData.problemsOverview,
        };
      } catch (err) {
        console.warn("GFG fetch failed for AI context:", err.message);
      }
    }

    const fullUserContext = {
      profile: {
        username: userProfile.username,
        targetRole: userProfile.targetRole,
        collegeName: userProfile.collegeName,
        currentYear: userProfile.currentYear,
        leetcodeName: userProfile.leetcodeName,
        gfgName: userProfile.gfgName,
      },
      goals: goals,
      completedProgressBySubject: progressData,
      geeksforGeeksStats: gfgSummary,
    };

    const result = await ai.generateResult(prompt, fullUserContext);

    await aiChatModel.create({
      userId: req.userId,
      prompt,
      response: result,
    });

    return res.status(200).json({
      message: "AI response generated successfully",
      result,
    });
  } catch (err) {
    console.error("AI Chat Error:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}

export async function getChatHistory(req, res) {
  try {
    const chats = await aiChatModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Chat history fetched successfully",
      chats,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
}
