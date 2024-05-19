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


import random
import string

# Lists of first names, last names, and achievements
first_names = [
    "Olivia", "Liam", "Emma", "Noah", "Ava",
    "Elijah", "Sophia", "James", "Isabella", "Benjamin"
]

last_names = [
    "Smith", "Johnson", "Brown", "Taylor", "Anderson",
    "Thomas", "Jackson", "White", "Harris", "Martin"
]

achievements = [
    "Discover a Hidden Gem: Visit a lesser-known local business",
    "Historical Insight: Tour a heritage site and learn its history",
    "Local Delicacy: Try a specialty dish from a local restaurant",
    "Artistic Capture: Photograph a public art installation",
    "Landmark Visit: Check-in at a famous city landmark",
    "Support Local: Make a purchase at a small business",
    "Nature Walk: Complete a nature walk in a local park",
    "Cultural Experience: Attend a cultural or community event",
    "History Buff: Answer a trivia question about local history correctly",
    "Festival Goer: Participate in a local festival or fair"
]

# Function to generate a random username
def generate_username(last_name):
    random_numbers = ''.join(random.choices(string.digits, k=3))
    random_Xs = 'X' * random.randint(1, 3)
    return f"{last_name}{random_numbers}{random_Xs}"

# Function to generate a random user
def generate_user():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    name = f"{first_name} {last_name}"
    username = generate_username(last_name)
    user_achievements = {achievement: random.choice([True, False]) for achievement in achievements}
    xp = random.randint(1, 999)
    return {
        "name": name,
        "username": username,
        "achievements": user_achievements,
        "location_history": [],
        "friends":[],
        "xp": xp,
        "profile_pic":""
    }

# Generate a list of 20 users
def update_friends():
        users = db.GET().get('data')
        user_ids = [str(user.get('id')) for user in users]
        for user_id in user_ids:
            friends = random.sample(user_ids, k=random.randint(0, len(user_ids) - 1))
            friends = [friend_id for friend_id in friends if friend_id != user_id]  # Exclude self
            print(f"Updating friends for user {user_id}: {friends}")
            print(type(friends))
            print(type([user_id]))
            print(type(["yippe"]))
            print(db.PATCH(user_id, {"friends": friends}))
#users = [db.POST(generate_user()) for _ in range(20)]
update_friends()


