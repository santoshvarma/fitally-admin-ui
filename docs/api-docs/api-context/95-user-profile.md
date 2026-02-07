User Profile
------------
GET /api/profile
Response:
```json
{
  "id": "uuid",
  "heightCm": 175,
  "weightKg": 72.5,
  "targetWeightKg": 68.0,
  "dateOfBirth": "1995-08-20",
  "gender": "MALE",
  "fitnessGoal": "FAT_LOSS",
  "activityLevel": "MODERATE",
  "experienceLevel": "BEGINNER",
  "unitPreference": "METRIC",
  "onboardingCompleted": false
}
```

PUT /api/profile
Request:
```json
{
  "heightCm": 175,
  "weightKg": 72.5,
  "targetWeightKg": 68.0,
  "dateOfBirth": "1995-08-20",
  "gender": "MALE",
  "fitnessGoal": "FAT_LOSS",
  "activityLevel": "MODERATE",
  "experienceLevel": "BEGINNER",
  "unitPreference": "METRIC",
  "onboardingCompleted": true
}
```
Response:
```json
{
  "id": "uuid",
  "heightCm": 175,
  "weightKg": 72.5,
  "targetWeightKg": 68.0,
  "dateOfBirth": "1995-08-20",
  "gender": "MALE",
  "fitnessGoal": "FAT_LOSS",
  "activityLevel": "MODERATE",
  "experienceLevel": "BEGINNER",
  "unitPreference": "METRIC",
  "onboardingCompleted": true
}
```
