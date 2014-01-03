When I talk about large banks in the US, I often think of them as being vast institutions distributed across the country. And it's true that large banks do business with companies throughout the country. But the heart of a bank, its deposit base, still retains its regional roots.

I built this map in order to show the regional homes of each big bank, but I expanded it to show all banks with at least one branch with deposits. As you can see, no bank really covers the whole country, and only a few cover multiple regions. Something to consider when you're thinking of changing banks and want to avoid ATM fees.

To build this map, I took data from the FDIC Summary of Deposits, and mapped it using Mike Bostock's D3 and topojson libraries. For selections, I used (and self-hosted) Johannes Jörg Schmidt's Selectable.js and for the tooltip used an older version of d3-tip. I cut off the list of banks displayed by the tooltip to the top 10 to keep the visuals manageable.

One note on the data: I combined the banks by charter, not by holding company (one corporation may own multiple banks charters, though it isn't especially common). I may re-create this by holding company in the future.
