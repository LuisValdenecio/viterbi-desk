import { NextResponse } from "next/server"
import  prisma  from "@/lib/prisma";
import { auth } from '@/auth'

export const GET = async (req, res) => {
    const session = await auth()

    try {
      // make these set of queries a transaction later...
  
      const my_teams = await prisma.user_privilege.findMany({
        where : {
          user_id : session?.user?.id
        }, 
        select : {
          team_id : true
        }
      })
      console.log("step 1")
  
      const my_teams_ids = my_teams.flatMap(team => team.team_id)
  
      const my_channels = await prisma.channel.findMany({
        where : {
          team_id : {
            in : my_teams_ids
          }
        },
        select : {
          channel_id : true
        },
        distinct: ['channel_id']
      })
      console.log("step 2")
  
      const my_channels_id = my_channels.flatMap(channel => channel.channel_id)
  
      const my_agents = await prisma.agent.findMany({
        where : {
          channel_id : {
            in : my_channels_id
          }
        },
        include : {
          tasks : {
            select : {
              name : true,
              priority : true,
              status : true,
              task_id : true
            }
          },
          channel : {
            select : {
              name : true
            }
          }
        }
      })
      console.log("step 3")
  
      const channels_owned = await prisma.channel.findMany({
        where : {
          owner_id : session?.user?.id
        },
        select : {
          channel_id : true
        }
      })
      console.log("step 4")
  
      if (channels_owned) {
  
        const channels_owned_id = channels_owned.flatMap(channel => channel.channel_id)
  
        const agents_owned = await prisma.agent.findMany({
          where : {
            channel_id : {
              in : channels_owned_id
            }
          },
          include : {
            tasks : {
              select : {
                name : true,
                priority : true,
                status : true,
                task_id : true
              }
            },
            channel : {
              select : {
                name : true
              }
            }
          }
        })
        console.log("step ")
    
        const results = my_agents.concat(agents_owned)
        const filtered = results.filter((value, index) => 
          results.findIndex((channel) => channel.agent_id == value.agent_id) == index  
        ) 
        return Response.json({filtered})
      }
      return Response.json({my_agents})
    
    } catch (error) {
        console.log(error)
        return new NextResponse("something bad happened", {
            status : 500
        })
    }
}