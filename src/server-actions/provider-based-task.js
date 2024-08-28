import TaskTemplateModel from '@/lib/mongo/taskTemplate'
import AgentModel from '@/lib/mongo/agents'
import ChannelModel from '@/lib/mongo/channels'
import GoogleTokenModel from '@/lib/mongo/googleTokens'
import DiscordTokenModel from '@/lib/mongo/discordTokens'
import url from 'url'
import axios from 'axios'
import { google } from "googleapis"


export async function executeDiscordTask(formData) {
    const agentId = formData.get('task-agent')

    try {
        const agent = await AgentModel.find({_id : agentId})
        const channel = await ChannelModel.find({_id : agent[0]?.channelId})
        const discordToken = await DiscordTokenModel.find({_id : channel[0]?.discordToken})

        const access_token = discordToken[0]?.access_token
        const token_type = discordToken[0]?.token_type

        const userDataResponse= await axios.get('https://discord.com/api/users/@me',{
            headers:{
                authorization: `${token_type} ${access_token}`
            }
        })

        console.log('DISCORD DATA ', userDataResponse.data)


    } catch (error) {
        console.log(error)
    }
}

export async function executeGmailTask(formData) {
    console.log(formData)

    const agentId = formData.get('task-agent')

    const token = {}

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/api/auth/callback/google'
    );

    try {
        const agent = await AgentModel.find({_id : agentId})
        console.log(agent)
        const channel = await ChannelModel.find({_id : agent[0]?.channel})
        console.log(channel)
        const googleToken = await GoogleTokenModel.find({_id : channel[0]?.googleToken})
        console.log(googleToken)

        token.access_token = googleToken[0]?.access_token
        token.refresh_token = googleToken[0]?.refresh_token
        token.scope = googleToken[0]?.scope

        oauth2Client.setCredentials(token);

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const messages = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
          });
      
          const messageDetailsPromises = messages.data.messages.map((message) =>
            gmail.users.messages.get({ userId: 'me', id: message.id })
          );
      
          const messageDetails = await Promise.all(messageDetailsPromises);
      
          console.log(messageDetails)
        

    } catch (error) {
        console.log(error)
        return {
            message : 'Could not run task, try again later'
        }
    }


}
