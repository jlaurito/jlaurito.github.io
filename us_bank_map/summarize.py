#! ~/pyenv/bin/python
# summarize data by institution and county



import pandas as pd


'''load data for branches'''
branches = pd.read_csv('data/branch_deposits.csv')


'''clean number format'''
branches['DEPSUMBR'] = branches['DEPSUMBR'].str.replace(",", "")
branches['DEPSUMBR'] = branches['DEPSUMBR'].apply(int)


'''summarize'''
deposits = branches.groupby(['STCNTYBR','RSSDID'], as_index=False).sum()


'''rank and percentages'''
deposits['county_rank'] = deposits.groupby(['STCNTYBR'])['DEPSUMBR'].rank(ascending=False)
deposits['perc_deposits'] = deposits.groupby(['STCNTYBR'])['DEPSUMBR'].apply(lambda x: x/x.sum().astype(float))
deposits['perc_deposits'] = 1000 * deposits['perc_deposits']
deposits['perc_deposits'] = deposits['perc_deposits'].round(0)
deposits['perc_deposits'] = deposits['perc_deposits']/10
deposits['county_rank'] = deposits['county_rank'].apply(str)

'''print'''
deposits.to_csv('data/summary_stats.csv',index=False)


'''load data for banks'''
banks = pd.read_csv('data/all_banks.csv')
banks = banks[pd.notnull(banks['DEPDOM'])]
banks['DEPDOM'] = banks['DEPDOM'].str.replace(',','')
banks['DEPDOM'] = banks['DEPDOM'].apply(int)
banks.sort('DEPDOM', ascending=False, inplace=True)

'''print'''
banks.to_json('data/banks.json', orient='records')
