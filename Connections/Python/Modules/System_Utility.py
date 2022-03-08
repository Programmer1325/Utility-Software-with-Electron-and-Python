from psutil import cpu_percent, virtual_memory, disk_usage, net_io_counters, sensors_battery
from time import sleep


class Task_Manager:
    def __init__(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, self1, self2, self3):
        pass

    def Get_Load_of_System(self, TypeOfLoad):
        Usage = []
        Second_Usage = []  # * This is for the OUT packets. The first Usage is for the IN packets

        while True:
            if TypeOfLoad == 'CPU':
                Usage.append(str(cpu_percent((2))))
            elif TypeOfLoad == 'RAM':
                Memory_Initializer = virtual_memory()
                Memory_Used = Memory_Initializer[0] - Memory_Initializer[1]
                Memory_Used_Percentage = round(
                    (Memory_Used / Memory_Initializer[0]) * 100, 2)

                Usage.append(str(Memory_Used_Percentage))
                sleep(1)

            elif TypeOfLoad == 'Hard-Drive':
                Usage.append(str(disk_usage('/')[-1]))
                sleep(1)

            elif TypeOfLoad == 'Network':
                Network_Initializer = net_io_counters()

                Usage.append(Network_Initializer[3])
                Second_Usage.append(Network_Initializer[2])

                sleep(2)

                if len(Second_Usage) > 20:
                    del Second_Usage[0]

                Second_Usage_in_String = ','.join(
                    [str(element) for element in Second_Usage])

                with open('Data/Network_Out_Packet_Load.txt', 'w') as Out_File:
                    Out_File.write(Second_Usage_in_String)
            elif TypeOfLoad == 'Battery':
                Usage.append(sensors_battery()[0])
                sleep(1)

            if len(Usage) > 20:
                del Usage[0]

            Usage_in_String = ','.join([str(element) for element in Usage])

            if TypeOfLoad == 'Network':
                with open('Data/Network_In_Packet_Load.txt', 'w') as File:
                    File.write(Usage_in_String)
            else:
                with open('Data/' + TypeOfLoad + '_Load.txt', 'w') as File:
                    File.write(Usage_in_String)
