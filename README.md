
Testing various setups for writing worker data from child processes. 

The master branch uses inherited stdio for child processes, which can result in overwritten data. This is the control state. Branches are various attempts to write 100% correct data.