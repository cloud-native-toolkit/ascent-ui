import {NextApiRequest, NextApiResponse} from "next";
import {LoggedInUser} from "@/models";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoggedInUser>
) {
    const user: LoggedInUser = {
        name: "Sean Sundberg",
        email: "seansund@us.ibm.com",
        region: "us-south",
        role: "admin"
    }
    console.log('User details', user)

    res.status(200).json(user)
}
