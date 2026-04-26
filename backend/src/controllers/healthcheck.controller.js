import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    // Return a 200 OK status with a success message
    return res
        .status(200)
        .json(new ApiResponse(200, { status: "OK" }, "Healthcheck passed. System is running properly."));
})

export {
    healthcheck
}