import pandas as pd
df = pd.read_csv('alzheimers_disease_data.csv')

avg_memory = round((df['MMSE']/30*60 + (1-df['MemoryComplaints'])*20 + (1-df['Forgetfulness'])*20).clip(0,100).mean(), 1)
avg_executive = round((df['FunctionalAssessment']/10*50 + (1-df['DifficultyCompletingTasks'])*30 + (1-df['Confusion'])*20).clip(0,100).mean(), 1)
avg_language = round((df['MMSE']/30*40 + (1-df['Disorientation'])*30 + (1-df['PersonalityChanges'])*30).clip(0,100).mean(), 1)
avg_attention = round((df['SleepQuality']/10*40 + (1-df['Confusion'])*30 + (1-df['BehavioralProblems'])*30).clip(0,100).mean(), 1)
avg_daily = round((df['ADL']/10*50 + df['DietQuality']/10*25 + df['PhysicalActivity']/10*25).clip(0,100).mean(), 1)

print(f'memory: {avg_memory}')
print(f'executive: {avg_executive}')
print(f'language: {avg_language}')
print(f'attention: {avg_attention}')
print(f'daily_living: {avg_daily}')
