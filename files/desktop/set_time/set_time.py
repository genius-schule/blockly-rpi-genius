from tkinter import *
from datetime import datetime
import os

#Submit Funktion
def click():
    var_day = entry_day.get()
    var_month = entry_month.get()
    var_year = entry_year.get()
    print("{}.{}.{}".format(var_day, var_month, var_year))
    var_hours = entry_hours.get()
    var_minutes = entry_minutes.get()
    var_seconds = "00"
    terminalCommand = "sudo timedatectl set-time '{}-{}-{} {}:{}:{}'".format(var_year, var_month, var_day, var_hours, var_minutes, var_seconds)
    #print(terminalCommand)
    succes = os.system(terminalCommand)
    outputText.delete(0.0, END)
    if succes == 0:
        outputText.config(bg="green")
        outputText.insert(END, "Zeit erfolgreich eingestellt.")
    else:
        outputText.config(bg="red")
        outputText.insert(END, "Ein Fehler ist aufgetreten.\nBitte versuche es erneut.")

#gets current systemtime
now = datetime.now()

#setup window
window = Tk()
window.title("Zeit Einstellung")


##
Label (window, text="Gib das heutige Datum ein:", font="none 12").grid(row=0, column=0, columnspan=6, pady=10)
#set text entry boxes
Label (window, text="Tag: ").grid(row=1, column=0, sticky=E)
entry_day = Entry(window, width=2)
entry_day.grid(row=1, column=1, sticky=W)
entry_day.insert(0, now.strftime("%d"))
Label (window, text=" (dd) ").grid(row=1, column=2, sticky=E)

Label (window, text="Monat: ").grid(row=1, column=3, sticky=E)
entry_month = Entry(window, width=2)
entry_month.grid(row=1, column=4, sticky=W)
entry_month.insert(0, now.strftime("%m"))
Label (window, text=" (mm) ").grid(row=1, column=5, sticky=E)

Label (window, text="Jahr: ").grid(row=1, column=6, sticky=E)
entry_year = Entry(window, width=4)
entry_year.grid(row=1, column=7, sticky=W)
entry_year.insert(0, now.strftime("%Y"))
Label (window, text=" (yyyy) ").grid(row=1, column=8, sticky=E)


##
Label (window, text="Gib die jetzige Uhrzeit ein:", font="none 12").grid(row=2, column=0, columnspan=6, pady=10)
#set text entry boxes
Label (window, text="Stunden: ").grid(row=3, column=0, columnspan=1, sticky=E)
entry_hours = Entry(window, width=2)
entry_hours.grid(row=3, column=1, sticky=W)
entry_hours.insert(0, now.strftime("%H"))
Label (window, text=" (hh) ").grid(row=3, column=2, sticky=W)

Label (window, text="Minuten: ").grid(row=3, column=3, columnspan=1, sticky=E)
entry_minutes = Entry(window, width=2)
entry_minutes.grid(row=3, column=4, sticky=W)
entry_minutes.insert(0, now.strftime("%M"))
Label (window, text=" (mm) ").grid(row=3, column=5, columnspan=2, sticky=W)


#set Button
Button(window, text="Zeit einstellen", width=15, bg="green", command=click, font="bold").grid(row=4, column=2, columnspan=4, pady=20)

#set Text-Output
outputText = Text(window, height=2, width=40, bg="lightgrey")
outputText.grid(row=5, column=0, columnspan=9)




window.mainloop()