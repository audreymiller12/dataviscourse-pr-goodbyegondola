rep = open("rep.txt", "r")
newData = open("new-data.json", "r+")

for line in rep:
    shit = line.split()
    f = newData.read()
    newData.write(f.replace(shit[0], shit[1])) 
