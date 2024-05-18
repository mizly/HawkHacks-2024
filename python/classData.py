import dbrequests as db
class User:
    def __init__(self,name, userName, achievements, locationHistory, friendsList):
        self.name = name
        self.userName = userName
        self.achievements = achievements
        self.locationHistory = locationHistory
        self.friendsList = friendsList

def addUser(User):
    db.POST("CommUnity", "Players", {"Username":User.userName,"Name":User.name, "Achievements":User.achievements, "Location History":User.locationHistory, "Friends List":User.friendsList})


p1 = User("VU", "yolooshawott", {"A_1":0, "A_2":1}, ["Vus Mum's house"], ["BBL Drizzy", "K NOT"])
addUser(p1)
