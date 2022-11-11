f = open("replacements.txt", "x")

for i in range(1, 18):
    f.write(str(i) + "-" + " " + str(i) + "\n")
    f.write(str(i) + "+" + " " + str(i+1) + "\n")
    f.write(str(i) + "-" + str(i+1) + " " + str(i+1) + "\n")
