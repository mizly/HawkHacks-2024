import neureloRequests as db
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
    db.POST({"username":User.userName,"name":User.name, "achievements":User.achievements, "location_history":User.locationHistory, "friends":User.friendsList, "xp":User.levelXP, "profile_pic":User.profile_pic})


p1 = User("Johnny", "JohnBoi7", {"A_1":0, "A_2":1}, ["Mum's house"], [], 680, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1UsseJLum7bkeD5q2e78A5FOb0BBENJSZNMQqy4fQXQ&s")
p2 = User("Vib", "Vibbyboi", {"A_1":0, "A_2":1}, ["Mom's house"], [], 680, "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D")
p3 = User("Danool","danyool", {"A_1":0, "A_2":1}, ["Mummy's house"], [], 680, "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9mbHVmZnlfY2h1YmJ5X3Bhc3RlbF9jYXRzX2thd2FpaV9hZXN0aGV0aWNfM182YTJkZjRmNS03NTZiLTQyODgtOWQ4Mi1lZmRlMmE1MTA2OWRfMS5qcGc.jpg")
p4 = User("Joel", "xx_shortking_xx", {"A_1":0, "A_2":1}, ["Mumsy's house"], [], 680, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZM1iwhFuBuRBSt1gsoSqzHaIlrm9f8j8AK8Y-7OkMpw&s")

addUser(p1)
addUser(p2)
addUser(p3)
addUser(p4)
db.PATCH("6648db43f07f2066e226e06b", {"friends": ["6648db42f07f2066e226dfe6","6648db431498b7e9a8fcd7d2", "6648db43f07f2066e226e0b5"]})
db.PATCH("6648db42f07f2066e226dfe6",  {"friends": ["6648db43f07f2066e226e06b","6648db431498b7e9a8fcd7d2", "6648db43f07f2066e226e0b5"]})
db.PATCH("6648db431498b7e9a8fcd7d2",  {"friends": ["6648db43f07f2066e226e06b","6648db42f07f2066e226dfe6", "6648db43f07f2066e226e0b5"]})
db.PATCH("6648db43f07f2066e226e0b5",  {"friends": ["6648db43f07f2066e226e06b","6648db431498b7e9a8fcd7d2", "6648db42f07f2066e226dfe6"]})

print(db.GET("CommUnity", "Players"))
