'use client'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TextLink } from '@/components/text'
import { FileUpIcon } from 'lucide-react'
import { useState } from 'react'
import Papa from 'papaparse'
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod";

const memberSchema = z.object({
  email: z.string().email(), // ensures the email field is a valid email string
  role : z.enum(["owner", "reader", "admin"])
});

const teamSchema = z.object({
  name : z.string().min(1),
  description: z.string().min(1)
})

const membersArraySchema = z.array(memberSchema);
const teamsArraySchema = z.array(teamSchema)

const acceptedCSVFileTypes = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv"

const validateData = (data) => {
  if (!teamsArraySchema.safeParse(data).success) return false;
  return true
};

const validateMembersInfo = (data) => {
  if (!membersArraySchema.safeParse(data).success) return false;
  return true
}

const uniqueByEmail = (array) => {
  const filteredArray = array.filter(data => data.email && data.role)
  const seen = new Set();  // Create a Set to track unique names
  const noRepeat = filteredArray.filter(invitation => {
    const duplicate = seen.has(invitation.email);  // Check if name has been seen
    seen.add(invitation.email);  // Add name to the Set
    return !duplicate;  // Keep the person only if it's not a duplicate
  });
  return noRepeat
};

const uniqueByName = (array) => {
  const filteredArray = array.filter(data => data.name && data.description)
  const seen = new Set();  // Create a Set to track unique names
  return filteredArray.filter(team => {
    const duplicate = seen.has(team.name);  // Check if name has been seen
    seen.add(team.name);  // Add name to the Set
    return !duplicate;  // Keep the person only if it's not a duplicate
  });
};

export function Upload_csv_dialog({ button_title, route, teamId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [contacts, setContacts] = useState('')
  const { toast } = useToast()

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    Papa.parse(file, {
        header : true,
        skipEmptyLines : true,
        complete: async function(results) {
            if (route === 'members' && teamId) {
              if (validateMembersInfo(uniqueByEmail(results.data))) {
                
                const response = await fetch(`/api/csv-file-upload/${route}`, {
                  method : "POST",
                  headers: {
                      "content-type" : "application/json",
                  },
                  body: JSON.stringify({
                      results : uniqueByEmail(results.data),
                      teamId
                  })
                }) 
  
                if (response.ok) {
                  const data = await response.json()
                  console.log("FROM THE SERVER: ", data)
                  if (data === 'You lack privileges') {
                    setIsOpen()
                    toast({
                      title: "Operation blocked",
                      description: `Your role on this team does not allow you to complete this operation`,
                    })
                  } else if (data === 'inviting owner') {
                    setIsOpen()
                    toast({
                      title: "Operation blocked",
                      description: `Only the team founder can invite members with 'owner' role`,
                    })
                  } else if (data === 'Resending invitations') {
                    setIsOpen()
                    toast({
                      title: "Operation blocked",
                      description: `Some of the emails on the list were already invited`,
                    })
                  } else if (data === 'Already registered') {
                    setIsOpen()
                    toast({
                      title: "Operation blocked",
                      description: `Some of the emails on your file are from users who are already members of this team`,
                    })
                  } else if (data.split(":")[0] === 'Repeated invite') {
                    setIsOpen()
                    toast({
                      title: "Operation blocked",
                      description: `${data.split(":")[1]} was already invited to join this team`,
                    })
                  } else if (data.split(":")[0] === 'Already registered') {
                    setIsOpen()
                    toast({
                      title: "Operation blocked",
                      description: `${data.split(":")[1]} is the email of a registered user.`,
                    })
                  } else {
                    setIsOpen()
                    toast({
                      title: "Operation completed",
                      description: `All the members on the .csv file were invited successfully.`,
                    })  
                  }
                }
              } else {
                setIsOpen()
                toast({
                  title: "Invalid upload",
                  description: `Makes sure the file is a valid CSV file with exactly two columns: 'email' and 'role'. All the emails must be valid. Roles can be 'owner', 'reader' or 'admin'`,
                })
              }
            } 

            // when uploading .csv files for teams and agents
            if (route === 'teams' || route === 'agents') {

              if (validateData(uniqueByName(results.data))) {
                const response = await fetch(`/api/csv-file-upload/${route}`, {
                  method : "POST",
                  headers: {
                      "content-type" : "application/json",
                  },
                  body: JSON.stringify({
                      results : uniqueByName(results.data)
                  })
                }) 
  
                if (response.ok) {
                  const data = await response.json()
                  
                  if (data.split(":")[0] === 'Repeated') {
                    setIsOpen()
                    toast({
                      title: "Repeated Team name",
                      description: `${data.split(":")[1]} already exists.`,
                    })
                  } else {
                    setIsOpen()
                    toast({
                      title: "Operation completed",
                      description: `All the teams on the .csv file were saved successfully.`,
                    })  
                  }
                }
              } else {
                setIsOpen()
                toast({
                  title: "Invalid upload",
                  description: `Makes sure the file is a valid CSV file with exactly two columns: 'name' and 'description'.`,
                })
              }
            } 
        }
    });    
  }

  return (
    <>
      <Button type="button" size="sm" variant="outline" className="h-8 gap-1" onClick={() => setIsOpen(true)}>
          <FileUpIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {button_title}
          </span>
      </Button>
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
            <input type="file" name="" id="csvFileSelector" accept={acceptedCSVFileTypes} onChange={handleFileChange}  />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
