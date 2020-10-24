
exports.getPath = function (req, res) {

  let { weather, o1Speed, o2Speed } = req.query

  let o1craters, o2craters;
  let t1 = {}
  let t2 = {}
  let t3 = {}
  let resObj = {}
  
  o1Speed = o1Speed / 60    //Orbit speed in mm per minute
  o2Speed = o2Speed / 60

  
  switch (weather) {
    case "SUNNY":
      o1craters = 20 - (0.1 * 20)   //10% reduction
      o2craters = 10 - (0.1 * 10)
  
      t1 = getTime(o1Speed, o2Speed, o1craters, o2craters, 'CAR')
      t2 = getTime(o1Speed, o2Speed, o1craters, o2craters, 'BIKE')
      t3 = getTime(o1Speed, o2Speed, o1craters, o2craters, 'TUKTUK')
      break;
  
    case "RAINY":
      o1craters = 20 + (0.2 * 20)   //20% increase
      o2craters = 10 + (0.2 * 10)
  
      t1 = getTime(o1Speed, o2Speed, o1craters, o2craters, 'CAR')
      t2 = getTime(o1Speed, o2Speed, o1craters, o2craters, 'TUKTUK')
      break;
  
    case "WINDY":
      o1craters = 20    //no change
      o2craters = 10
  
      t1 = getTime(o1Speed, o2Speed, o1craters, o2craters, 'CAR')
      t2 = getTime(o1Speed, o2Speed, o1craters, o2craters, 'BIKE')
  }
  
  if (t1.time < t2.time) {
    resObj = t1
  } else {
    resObj = t2
  }
  
  if ('time' in t3) {
    if (t3.time < resObj.time) {
      resObj = t3
    }
  }
  
  res.status(200).json(resObj)
}


function getTime (o1Speed, o2Speed, o1craters, o2craters, vehicle) {

  let map = {
    'CAR' : {
      speed : 20/60,    //expressed in mm per minute
      crateTime: 3
    },
    'BIKE' : {
      speed: 10/60,
      crateTime: 2
    },
    'TUKTUK' : {
      speed : 12/60,
      crateTime : 1
    }
  }

  let o1VehicleSpeed = (map[vehicle].speed <= o1Speed ? map[vehicle].speed : o1Speed)
  let o2VehicleSpeed = (map[vehicle].speed <= o2Speed ? map[vehicle].speed : o2Speed) 

  let o1Time = Number(((18/o1VehicleSpeed) + (map[vehicle].crateTime * o1craters)).toFixed(2))
  let o2Time = Number(((20/o2VehicleSpeed) + (map[vehicle].crateTime * o2craters)).toFixed(2))

  if (o1Time < o2Time) {
    return ({time: o1Time, orbit: 'ORBIT1', vehicle: vehicle})
  } else {
    return ({time: o2Time, orbit: 'ORBIT2', vehicle: vehicle})
  }
}
