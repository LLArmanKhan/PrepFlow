import * as cp from "../services/gfg.service.js"
import userModel from "../models/user.model.js"

export async function gfgData(req,res) {
    const user = await userModel.findById(req.userId)
    const data = await cp.getGfgCodingData(user.gfgName)
    res.send(data)
}