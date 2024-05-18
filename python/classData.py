import dbrequests as db
class User:
    def __init__(self,name, userName, achievements, locationHistory, friendsList, levelXP, profile_picture):
        self.name = name
        self.userName = userName
        self.achievements = achievements
        self.locationHistory = locationHistory
        self.friendsList = friendsList
        self.levelXP = levelXP
        self.profile_pic = profile_picture

def addUser(User):
    db.POST("CommUnity", "Players", {"username":User.userName,"name":User.name, "achievements":User.achievements, "location_history":User.locationHistory, "friends":User.friendsList, "xp":User.levelXP, "profile_pic":User.profile_pic})


p1 = User("Johnny", "JohnBoi7", {"A_1":0, "A_2":1}, ["Mum's house"], ["XXbbXX", "Spy"], 680, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1UsseJLum7bkeD5q2e78A5FOb0BBENJSZNMQqy4fQXQ&s")
addUser(p1)
print(db.GET("CommUnity", "Players"))
