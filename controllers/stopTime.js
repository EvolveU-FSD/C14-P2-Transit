const tripController = require("../controllers/trip");
const routeArchiveController = require("../controllers/routeArchive");
const calendarController = require("../controllers/calendar");
const calendarDateController = require("../controllers/calendarDate");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb"); // Add this for ObjectId

const stopTimeSchema = {
  trip_id: {
    type: Number,
  },
  departure_time: {
    type: String,
  },
  stop_id: {
    type: Number,
  },
  stop_sequence: {
    type: Number,
  },
};
const DATABASE_NAME = "Transit";
const COLLECTION_NAME = "StopTime";

const getStopTimeModel = () => {
  const db = mongodb.getDatabase();
  return (
    db.models[COLLECTION_NAME] ||
    db.model(COLLECTION_NAME, stopTimeSchema, COLLECTION_NAME)
  );
};
const getAllStopTimes = async (req, res) => {
  try {
    const StopTime = getStopTimeModel();
    const results = await StopTime.find().exec();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching stop times:", err);
    res.status(500).json({ message: err.message });
  }
};
const getSingleStopTime = async (req, res) => {
  try {
    const StopTime = getStopTimeModel();
    const stopTime = await StopTime.findById(req.params.id).exec();

    if (!stopTime) {
      return res.status(404).json({ message: "Stop time not found" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(stopTime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStopTimesByTripId = async (req, res) => {
  try {
    const StopTime = getStopTimeModel();
    const stopTimes = await StopTime.find({ trip_id: req.params.id }).exec();

    if (!stopTimes || stopTimes.length === 0) {
      return res
        .status(404)
        .json({ message: "No stop times found for this trip ID" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(stopTimes);
  } catch (err) {
    console.error("Error fetching stop times by trip ID:", err);
    res.status(500).json({ message: err.message });
  }
};
const getStopTimesByStopId = async (req, res) => {
  try {
    const StopTime = getStopTimeModel();
    const stopTimes = await StopTime.find({ stop_id: req.params.id }).exec();

    if (!stopTimes || stopTimes.length === 0) {
      return res
        .status(404)
        .json({ message: "No stop times found for this stop ID" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(stopTimes);
  } catch (err) {
    console.error("Error fetching stop times by stop ID:", err);
    res.status(500).json({ message: err.message });
  }
};

const getStopTimesByStopIdAndRouteId = async (req, res) => {
  try {
    const Trip = tripController.getTripModel();
    const RouteArchive = routeArchiveController.getRouteArchiveModel();
    const Calendar = calendarController.getCalendarModel();
    const CalendarDate = calendarDateController.getCalendarDateModel();
    const StopTime = getStopTimeModel();

    // Find the route by route_short_name
    const route = await RouteArchive.findOne({
      route_short_name: req.params.route_id,
    }).exec();
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Find all trips for the given route_id
    const trips = await Trip.find({ route_id: route.route_id }).exec();
    if (!trips || trips.length === 0) {
      return res
        .status(404)
        .json({ message: "No trips found for this route ID" });
    }
    // Get today's date and format it
    const today = new Date();
    const todayFormatted = today.toISOString().slice(0, 10).replace(/-/g, "");

    const activeTrips = await Promise.all(
      trips.map(async (trip) => {
        const calendar = await Calendar.findOne({
          service_id: trip.service_id,
        }).exec();

        if (!calendar) return null;

        // Get weekday name in lowercase
        const weekdays = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const weekday = weekdays[today.getDay()];

        // Check all conditions
        const isWeekdayActive = calendar[weekday] === 1;
        const isAfterStart = calendar.start_date <= todayFormatted;
        const isBeforeEnd = calendar.end_date >= todayFormatted;

        // Return trip only if all conditions are met
        return isWeekdayActive && isAfterStart && isBeforeEnd ? trip : null;
      })
    ).then((trips) => trips.filter(Boolean)); // Remove null values

    const scheduleExceptions = await CalendarDate.find().exec();
    const unexceptedActiveTrips = activeTrips.filter((trip) => {
      // Find all exceptions for this service_id
      const exceptions = scheduleExceptions.filter(
        (e) => e.service_id === trip.service_id
      );
      // Check if any exception matches today's date and type 2
      return !exceptions.some(
        (e) => e.exception_type === "2" && e.date === todayFormatted
      );
      //will only return trips that are active and not on schedule exceptions
    });

    // Fetch stop times for all trips and filter by stop_id
    //SLOWEST STEP
    //52 TRIPS AT THIS POINT FOR ROUTE 4 STOP 9011
    const stopTimes = await Promise.all(
        unexceptedActiveTrips.map(async (trip) => {
        const stopTimesForATrip = await StopTime.find({
          trip_id: trip.trip_id,
        }).exec();
        return stopTimesForATrip.filter(
          (stopTime) => stopTime.stop_id == req.params.stop_id
        );
      })
    );

    // Flatten the array of arrays and filter out empty results
    const relevantStopTimes = stopTimes.flat().filter((stopTime) => stopTime);

    if (relevantStopTimes.length === 0) {
      return res
        .status(404)
        .json({ message: "No stop times found for this stop ID and route ID" });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(relevantStopTimes);
  } catch (err) {
    console.error("Error fetching stop times by stop ID and route ID:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllStopTimes,
  getSingleStopTime,
  getStopTimesByTripId,
  getStopTimesByStopId,
  getStopTimesByStopIdAndRouteId,
};
