import  TeamsCard  from "./(components)/teamsCard"
import  ChannelsCard  from "./(components)/channelsCard"
import  TasksCard from "./(components)/tasksCard"
import AgentsCard from "./(components)/agentsCard"
import RecentAgents from "./(components)/recentAgents"
import RecentTasks from "./(components)/recentTasks"

export const description =
  "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image."

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <ChannelsCard />
          <TeamsCard />
          <AgentsCard />
          <TasksCard />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <RecentTasks />
          <RecentAgents />
        </div>
      </main>
    </div>
  )
}
