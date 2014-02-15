##Image Hitter

A simple site built with express and mongo(mongoose) to log the data traffic to particular images embedded in user profiles.  It also uses socket.io for watching the data being logged in realtime and uses mustache templates to display the parsed data sent from the socket.  Twitter bootstrap is used for the styling and jquery for frontend.

It uses an api lookup from [ipinfo.io](http://ipinfo.io), but only using the limited 1000 lookups per day.

#####Note: There is no authentication or authorization

####Directions
-------
1. Run npm install and make sure you have mongodb installed
2. Place a .jpg image in /public/images
3. Place that image in any website that you can link it in
4. Go to index for the realtime hits and /history for the logged data
5. Profit

---------
####Todo
Decouple code from app.js and make it work better