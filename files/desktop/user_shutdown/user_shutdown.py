from tkinter import *
import os

#Submit Funktion
def clickPoweroff():
    terminalCommand = "sudo poweroff"
    os.system(terminalCommand)
    
def clickReboot():
    terminalCommand = "sudo reboot"
    os.system(terminalCommand)
    
def clickClose():
    window.destroy()
    


#setup window
window = Tk()
window.title("Poweroff")


#set Button
Button(window, text="Herunterfahren", width=15, bg="grey", command=clickPoweroff, font="bold").grid(row=0, column=0, pady=10)
Button(window, text="Neustarten", width=15, bg="grey", command=clickReboot, font="bold").grid(row=1, column=0, pady=10)
Button(window, text="Abbrechen", width=15, bg="red", command=clickClose, font="bold").grid(row=2, column=0, pady=10)



window.mainloop()