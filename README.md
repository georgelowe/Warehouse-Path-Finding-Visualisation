# Warehouse Path Finding Visualisation

Search algorithm visualisation project for warehouse pick routes.

--> make results show as div cards
--> add return value for 'explored nodes' so we can compare the unweighted and weighted algs
--> refactor everything
--> add expored tiles count?
--> colour explored tiles?
--> animate the visualise function so that it shows it slowly drawing the route?
--> animate the solve function so it shows as tiles are being explored and only draw the path once its done
--> map generation
--> Create hash of edges between nodes to assist in mapping optimal route?

Find Optimal Route button --> draws out all edges and appends edge info to edge div, then appends route info to route div, then appends optimal route to optimal route div, then finally calls (with set timeout) method to clear grid and plot the final route
