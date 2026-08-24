// // // import * as gfgData from "./gfg.service.js"
// // // import * as goal from "../controllers/goals.controller.js"
// // // import * as progress from "../controllers/progress.controller.js"
// // // import * as profile from "../controllers/profile.controller.js"

// // // import userModel from "../models/user.model.js"

// // // export async function userGoals(req,res){
// // //     const goals = goal.getGoals() 
// // // }

// // // export async function userProgress(req,res){
// // //     const totalProgress = progress.getAllProgress
// // //     // const subjectProgress = progress.getSubjectProgress()
// // //     // .getSubjectProgress expects subject name in params

// // // }

// // // export async function userDetail(req,res){
// // //     const detail = profile.getprofile
// // //     .select("targetRole collegeName currentYear")
// // // }

// // // export async function userGfgData(req,res){
// // //     const gfg = gfgData.getGfgCodingData
// // // }





// // import * as gfgService from "./gfg.service.js";
// // import * as goalController from "../controllers/goals.controller.js";
// // import * as progressController from "../controllers/progress.controller.js";
// // import * as profileController from "../controllers/profile.controller.js";


// // export async function getUserGoals(req,res) {
// //   const goals = await goalController.getGoals();
// //   return { goals: goals || "No specific goals set yet." };
// // }


// // export async function getUserProgress(req,res) {
// //   if (subjectName) {
// //     const subjectData = await progressController.getSubjectProgress(subjectName);
// //     return subjectData || { message: `No progress found for ${subjectName}` };
// //   }
// //   const totalProgress = await progressController.getAllProgress();
// //   return totalProgress;
// // }


// // export async function getUserDetail(req,res) {
// //   const detail = await profileController.getProfile()
// //     .select("targetRole collegeName currentYear");   // targetCompanies
// //   return detail;
// // }


// // export async function getUserGfgData(gfgHandle) {
// //   const rawData = await gfgService.getGfgCodingData(gfgHandle);
  
// //   // Gemini ko heavy response bhejne ke bajaye slim/optimized return karo
// //   return {
// //     codingScore: rawData.codingScore,
// //     totalProblemsSolved: rawData.totalProblemsSolved,
// //     currentStreak: rawData.currentStreak,
// //     breakdown: rawData.problemsOverview,
// //     recentSolved: rawData.solvedProblems.slice(0, 10) // Sirf last 10 questions
// //   };
// // }





// import { getGoals } from "../controllers/goals.controller.js";
// import { getAllProgress } from "../controllers/progress.controller.js";
// import { getprofile } from "../controllers/profile.controller.js";
// import { getGfgCodingData } from "../services/gfg.service.js";

// // Express Controllers se data extract karne ke liye Mock Helper
// const mockRes = () => {
//   const res = {};
//   res.status = () => res;
//   res.json = (data) => { res.data = data; return res; };
//   return res;
// };

// export async function getUserContextSnapshot(userId) {
//   try {
//     const req = { userId };

//     // 1. Fetch Goals
//     const goalsRes = mockRes();
//     await getGoals(req, goalsRes);
//     const goals = goalsRes.data?.goals || [];

//     // 2. Fetch All Progress
//     const progressRes = mockRes();
//     await getAllProgress(req, progressRes);
//     const progressData = progressRes.data?.data || {};

//     // 3. Fetch User Profile
//     const profileRes = mockRes();
//     await getprofile(req, profileRes);
//     const userProfile = profileRes.data?.user || {};

//     // 4. Fetch GFG Data (excluding heavy solvedProblems)
//     let gfgSummary = null;
//     if (userProfile.gfgName) {
//       try {
//         const rawGfgData = await getGfgCodingData(userProfile.gfgName);
        
//         // SolvedProblems array intentionally drop kar di hai
//         gfgSummary = {
//           codingScore: rawGfgData.codingScore,
//           monthlyScore: rawGfgData.monthlyScore,
//           totalProblemsSolved: rawGfgData.totalProblemsSolved,
//           potdSolvedCount: rawGfgData.potdSolvedCount,
//           currentStreak: rawGfgData.currentStreak,
//           longestStreak: rawGfgData.longestStreak,
//           difficultyBreakdown: rawGfgData.problemsOverview
//         };
//       } catch (err) {
//         console.warn("GFG Data fetch failed for AI context, continuing without it.");
//       }
//     }

//     // Single Compact Context Snapshot Object
//     return {
//       profile: {
//         username: userProfile.username,
//         targetRole: userProfile.targetRole,
//         collegeName: userProfile.collegeName,
//         currentYear: userProfile.currentYear,
//       },
//       goals: goals,
//       completedProgressBySubject: progressData,
//       gfgCodingStats: gfgSummary,
//     };
//   } catch (error) {
//     console.error("Error creating AI user context:", error);
//     return null;
//   }
// }