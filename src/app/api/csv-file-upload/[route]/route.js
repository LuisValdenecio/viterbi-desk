import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export const POST = async (req, { params }) => {
    const session = await auth()
    const results = await req.json()
    console.log("DATA: ", results.results.data)
    console.log("ROUTE:", params.route)

    try {
    
        switch(params.route) {

            case 'teams':

                const team_names = results.results.data.flatMap(team => team.name)

                const check_repeated_names = await prisma.team.findMany({
                    where : {
                        name : {
                            in : team_names
                        }
                    },
                    select : {
                        name : true
                    }
                })

                if (check_repeated_names.length > 0) {
                    return Response.json(`Repeated: ${check_repeated_names[0].name}`)
                }

                const teams = results.results.data.map((team) => {
                    return {
                        name : team.name,
                        description : team.description
                    }
                })
               
                teams.forEach(async team => {
                    const team_saved = await prisma.team.create({
                        data : {
                            name : team.name,
                            description : team.description,
                            user_id : session?.user?.id
                        }
                    })

                    const team_membership = await prisma.user_privilege.create({
                        data : {
                            role : 'owner',
                            status : 'active',
                            user_id : session?.user?.id,
                            team_id : team_saved.team_id
                        }
                    })
                })

                return Response.json("teams saved")

            case 'agents':

                break
            default :
                break
        }


        //return Response.json(resultData)
    } catch(e) {
        console.log(e)
        return new NextResponse("couldnt updload", {
            status : 500
        })
    }
    return new NextResponse("data saved", {
        status : 201
    })
   
}

