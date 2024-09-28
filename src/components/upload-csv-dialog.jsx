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

const acceptedCSVFileTypes = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv"

const validateData = (data) => {
  if (!Array.isArray(data)) return false;
  // Check if data has exactly two properties: 'name' and 'description'
  if (!data.every(item => 
    Object.keys(item).length === 2 &&
    'name' in item &&
    'description' in item
  )) return false;

  // Check for empty string values for either property
  if (data.some(item => item.name.trim() === '' || item.description.trim() === '')) return false;

  return data.every(data => 
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'description' in data &&
    typeof data.name === 'string' &&
    typeof data.description === 'string'
  );
};

export function Upload_csv_dialog({ button_title, route }) {
  const [isOpen, setIsOpen] = useState(false)
  const [contacts, setContacts] = useState('')
  const { toast } = useToast()

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    Papa.parse(file, {
        header : true,
        skipEmptyLines : true,
        complete: async function(results) {
            console.log(results.data, " IS VALID?: ", validateData(results.data))
            if (validateData(results.data)) {
              const response = await fetch(`/api/csv-file-upload/${route}`, {
                method : "POST",
                headers: {
                    "content-type" : "application/json",
                },
                body: JSON.stringify({
                    results
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


      {/*<Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Add multiple contacts</DialogTitle>
        <DialogDescription>
          add contacts through a .csv file. <TextLink href="#">Download an example</TextLink>.
        </DialogDescription>
        <DialogBody>
          <input type="file" name="" id="csvFileSelector" accept={acceptedCSVFileTypes} onChange={handleFileChange}  />
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button>save</Button>
        </DialogActions>
      </Dialog>*/}
    </>
  )
}
