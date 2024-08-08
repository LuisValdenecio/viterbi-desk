'use client'

import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { TextLink } from '@/components/text'
import { PlusIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import Papa from 'papaparse'

const acceptedCSVFileTypes = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv"

export function Upload_csv_dialog({ button_title: btn_title }) {
  const [isOpen, setIsOpen] = useState(false)
  const [contacts, setContacts] = useState('')

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    Papa.parse(file, {
        header : true,
        skipEmptyLines : true,
        complete: async function(results) {
            console.log(results.data)
            const response = await fetch(`/api/csv-file-upload`, {
                method : "POST",
                headers: {
                    "content-type" : "application/json",
                },
                body: JSON.stringify({
                    results
                })
            })

            if (response.status == 201) setIsOpen(false)
        }
    });
   
    

    
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon />
        {btn_title}
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
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
      </Dialog>
    </>
  )
}
