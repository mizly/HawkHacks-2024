import dbrequests as db
class User:
    def __init__(self,name, userName, achievements, locationHistory, friendsList, levelXP):
        self.name = name
        self.userName = userName
        self.achievements = achievements
        self.locationHistory = locationHistory
        self.friendsList = friendsList
        self.levelXP = levelXP

def addUser(User):
    db.POST("CommUnity", "Players", {"username":User.userName,"name":User.name, "achievements":User.achievements, "location_history":User.locationHistory, "friends":User.friendsList, "xp":User.levelXP})


p1 = User("Johnny", "JohnBoi7", {"A_1":0, "A_2":1}, ["Mum's house"], ["XXbbXX", "Spy"], 10)
addUser(p1)
print(db.GET("CommUnity", "Players"))