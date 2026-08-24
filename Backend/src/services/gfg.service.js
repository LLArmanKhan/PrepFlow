import axios from "axios";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Origin: "https://www.geeksforgeeks.org",
};

export async function getGfgCodingData(username) {
  if (!username || typeof username !== "string" || !username.trim()) {
    throw new Error("GFG handle missing");
  }

  const cleanUsername = username.trim();
  console.log(`[GFG Service] Fetching data for user: ${cleanUsername}`);

  let problemsOverview = {
    school: 0,
    basic: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  };
  let solvedProblemsList = [];
  let practiceApiSuccess = false;

  try {
    const practiceApiUrl =
      "https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/";
    const practiceRes = await axios.post(
      practiceApiUrl,
      {
        handle: cleanUsername,
        requestType: "",
        year: "",
        month: "",
      },
      {
        headers: {
          ...DEFAULT_HEADERS,
          "Content-Type": "application/json",
          Referer: `https://www.geeksforgeeks.org/profile/${cleanUsername}`,
        },
        timeout: 10000,
        validateStatus: () => true,
      },
    );

    if (
      practiceRes.status === 200 &&
      practiceRes.data &&
      practiceRes.data.result
    ) {
      const result = practiceRes.data.result;
      const schoolObj = result.School || result.school || {};
      const basicObj = result.Basic || result.basic || {};
      const easyObj = result.Easy || result.easy || {};
      const mediumObj = result.Medium || result.medium || {};
      const hardObj = result.Hard || result.hard || {};

      problemsOverview = {
        school: Object.keys(schoolObj).length,
        basic: Object.keys(basicObj).length,
        easy: Object.keys(easyObj).length,
        medium: Object.keys(mediumObj).length,
        hard: Object.keys(hardObj).length,
      };

      const difficulties = [
        { name: "School", obj: schoolObj },
        { name: "Basic", obj: basicObj },
        { name: "Easy", obj: easyObj },
        { name: "Medium", obj: mediumObj },
        { name: "Hard", obj: hardObj },
      ];

      for (const diff of difficulties) {
        for (const [key, item] of Object.entries(diff.obj)) {
          const val = item;
          solvedProblemsList.push({
            slug: val.slug || key,
            pname: val.pname || val.title,
            lang: val.lang,
            user_subtime: val.user_subtime,
            difficulty: diff.name,
          });
        }
      }

      practiceApiSuccess = true;
      console.log(`[GFG Service] Practice API success:`, problemsOverview);
    }

    else if (
      practiceRes.status === 406 ||
      practiceRes.data?.message?.includes("valid User Details")
    ) {
      console.warn(
        `[GFG Service] Practice API indicated user does not exist: ${cleanUsername}`,
      );
    }
  } catch (err) {
    console.warn(`[GFG Service] Practice API request failed: ${err.message}`);
  }

  let codingScore = 0;
  let monthlyScore = 0;
  let totalProblemsSolved = 0;
  let potdSolvedCount = 0;
  let podCorrectSubmissions = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let userProfileExtra;
  let authApiSuccess = false;

  try {
    const authApiUrl = `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${encodeURIComponent(
      cleanUsername,
    )}&article_count=false&redirect=true`;

    const authRes = await axios.get(authApiUrl, {
      headers: {
        ...DEFAULT_HEADERS,
        Referer: `https://www.geeksforgeeks.org/profile/${cleanUsername}`,
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    if (authRes.status === 200 && authRes.data && authRes.data.data) {
      const data = authRes.data.data;
      codingScore =
        typeof data.score === "number"
          ? data.score
          : parseInt(data.score, 10) || 0;
      monthlyScore =
        typeof data.monthly_score === "number"
          ? data.monthly_score
          : parseInt(data.monthly_score, 10) || 0;
      totalProblemsSolved =
        typeof data.total_problems_solved === "number"
          ? data.total_problems_solved
          : parseInt(data.total_problems_solved, 10) || 0;
      podCorrectSubmissions =
        typeof data.pod_correct_submissions_count === "number"
          ? data.pod_correct_submissions_count
          : parseInt(data.pod_correct_submissions_count, 10) || 0;
      currentStreak =
        typeof data.pod_solved_current_streak === "number"
          ? data.pod_solved_current_streak
          : parseInt(data.pod_solved_current_streak, 10) || 0;
      longestStreak =
        typeof data.pod_solved_longest_streak === "number"
          ? data.pod_solved_longest_streak
          : parseInt(data.pod_solved_longest_streak, 10) || 0;

      userProfileExtra = {
        name: data.name,
        profileImageUrl: data.profile_image_url,
        institution:
          data.school || data.institute_name || data.organization_name,
        globalLongestStreak: data.pod_solved_global_longest_streak,
        totalArticles: data.total_articles_published,
      };

      authApiSuccess = true;
      console.log(
        `[GFG Service] Auth API success: score=${codingScore}, total=${totalProblemsSolved}`,
      );
    } else if (
      authRes.status === 400 ||
      authRes.data?.message?.includes("not found")
    ) {
      throw new Error(`GFG Handle '${cleanUsername}' does not exist.`);
    }
  } catch (err) {
    if (err.message.includes("does not exist")) {
      throw err;
    }
    console.warn(`[GFG Service] Auth API request failed: ${err.message}`);
  }

  if (!authApiSuccess) {
    try {
      console.log(
        `[GFG Service] Attempting fallback HTML/RSC extraction for ${cleanUsername}...`,
      );
      const profileUrl = `https://www.geeksforgeeks.org/profile/${cleanUsername}`;
      const response = await axios.get(profileUrl, {
        headers: {
          ...DEFAULT_HEADERS,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 10000,
      });

      const html = response.data;
      const scriptRegex = /self\.__next_f\.push\(\[1,"(.*?)"\]\)/g;
      let combinedStreamData = "";
      let match;

      while ((match = scriptRegex.exec(html)) !== null) {
        combinedStreamData += match[1];
      }

      const unescapedData = combinedStreamData
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\")
        .replace(/\\n/g, "");

      const scoreMatch = unescapedData.match(/"score":(\d+)/);
      const totalMatch =
        unescapedData.match(/"total_problems_solved":(\d+)/) ||
        unescapedData.match(/"totalProblemSolved":(\d+)/);
      const monthlyMatch = unescapedData.match(/"monthly_score":(\d+)/);
      const potdMatch = unescapedData.match(/"potdSolvedCount":(\d+)/);
      const podCorrectMatch = unescapedData.match(
        /"pod_correct_submissions_count":(\d+)/,
      );
      const podCurrentStreakMatch = unescapedData.match(
        /"pod_solved_current_streak":(\d+)/,
      );
      const podLongestStreakMatch = unescapedData.match(
        /"pod_solved_longest_streak":(\d+)/,
      );

      const getNumber = (m) => (m ? parseInt(m[1], 10) : 0);

      if (!scoreMatch && !totalMatch && !practiceApiSuccess) {
        throw new Error(
          `Profile '${cleanUsername}' not found or has no coding activity.`,
        );
      }

      codingScore = getNumber(scoreMatch);
      monthlyScore = getNumber(monthlyMatch);
      totalProblemsSolved = getNumber(totalMatch);
      potdSolvedCount = getNumber(potdMatch);
      podCorrectSubmissions = getNumber(podCorrectMatch);
      currentStreak = getNumber(podCurrentStreakMatch);
      longestStreak = getNumber(podLongestStreakMatch);
    } catch (fallbackError) {
      if (!practiceApiSuccess) {
        throw fallbackError;
      }
    }
  }

  const totalFromBreakdown =
    problemsOverview.school +
    problemsOverview.basic +
    problemsOverview.easy +
    problemsOverview.medium +
    problemsOverview.hard;

  if (totalProblemsSolved === 0 && totalFromBreakdown > 0) {
    totalProblemsSolved = totalFromBreakdown;
  }

  return {
    username: cleanUsername,
    codingScore,
    monthlyScore,
    totalProblemsSolved,
    potdSolvedCount,
    podCorrectSubmissions,
    currentStreak,
    longestStreak,
    problemsOverview,
    solvedProblems: solvedProblemsList,
    userProfile: userProfileExtra,
  };
}
