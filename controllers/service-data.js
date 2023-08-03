// database
const fs = require('fs');
const models = require("../connect-to-database");
const Services = models.Services;

function search(keyword, attribute, dbServices, filteredData) {
  // list of matches
  for (service of dbServices) {
    //find out if text is in the given attribute
    text = service[attribute].toLowerCase();
    if (text.includes(keyword.toLowerCase())) {
      // don't create miltiple copies of the same result if the keyword appears twice
      if (filteredData.includes(service)) {

      }
      else {
        filteredData.push(service)
      }
    }
  }
  return filteredData;
}

const sharp = require('sharp');

const generateThumbnail = async function (photoBuffer) {
  try {
    // Load the photo buffer from the service

    // Create a thumbnail with lower resolution using sharp
    const thumbnailBuffer = await sharp(photoBuffer)
      .resize(600, 6 * 67) // Set the desired thumbnail dimensions
      .toBuffer();

    // Convert the thumbnail buffer to a base64-encoded string
    const thumbnailBase64 = thumbnailBuffer.toString('base64');

    // Create a new Buffer object with the Base64-encoded string
    const thumbnailBinData = new Buffer.from(thumbnailBase64, 'base64');

    // Update the service object with the thumbnail field as BinData


    return thumbnailBinData;
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Error generating thumbnail' };
  }
};

exports.store_add_service = async function (req, username) {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const time = hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();

    const pages = JSON.parse(req.body.pages);

    const photoBuffer = fs.readFileSync(req.file.path);
    const thumbnail = await generateThumbnail(photoBuffer)
    const newService = new Service({
      title: req.body.title,
      serviceType: req.body.serviceType,
      photo: photoBuffer,
      thumbnail: thumbnail,
      pages: pages,
      datePosted: formattedDate,
      timePosted: time,
      user: username
    });
    // make a thumbnail

    await newService.save();

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.find_filter_service = async function (sortingType, serviceType, fields, categories) {
  try {
    serviceTypes = serviceType.split(',');
    categories = categories.split('>');
    console.log(`filterType: ${serviceTypes}, sortingType: ${sortingType}`);
    var sort;
    switch (sortingType) {
      case 'reverse_alphabetical':
        sort = -1;
        break;
      default:
        sort = 1;
    }
    if (serviceTypes.includes('all') & categories.includes('all')) {
      services = await Services.find()
        .select(fields)
        .sort({ title: sort })
        .exec();
    } else if (serviceTypes.includes('all')) {
      services = await Services.find({
        categories: { $in: categories }
      })
        .select(fields)
        .sort({ title: sort })
        .exec();
    } else if (categories.includes('all')) {
      services = await Services.find({
        serviceType: { $in: serviceTypes }
      })
        .select(fields)
        .sort({ title: sort })
        .exec();
    } else {
      services = await Services.find({
        serviceType: { $in: serviceTypes },
        categories: { $in: categories }
      })
        .select(fields)
        .sort({ title: sort })
        .exec();
    }
    return services;
  } catch (err) {
    console.log(err);
    return { success: false, error: 'internal database error' };
  }
}

// get all services from database
exports.get_services = async function (keywords, fields, sortingType, serviceType, categories) {
  try {
    filteredData = [];
    foundServices = await find_filter_service(sortingType, serviceType, fields, categories);

    filterAttribute = 'title';
    if (keywords != undefined) {
      keywords = keywords.trim();
      var subStrings = keywords.split(" ");
      for (subString of subStrings) {
        filteredData = search(subString, filterAttribute, foundServices, filteredData);
      }
    } else {
      // if no query has been made, return all services
      filteredData = foundServices;
    }
    return filteredData;

  } catch (error) {
    console.log(error);
    return { success: false, error: 'internal database error' };
  }
}

exports.delete_service = async function (service_name) {
  try {
    const selected_service = await Services.deleteOne({ title: service_name });

    if (!selected_service) {
      console.error(`No service found with the name '${service_name}'.`);
      return { success: false, error: 'no service with the provided name' };
    }

    return selected_service;
  } catch (error) {
    console.error(error);
    return { success: false, error: 'internal database error' };
  }
};

exports.get_one_service = async function (service_name) {
  try {
    const selected_service = await Services.findOne({ title: service_name }).exec();

    if (!selected_service) {
      console.error(`No service found with the name '${service_name}'.`);
      return { success: false, error: 'no service with the provided name' };
    }

    return selected_service;
  } catch (error) {
    console.error(error);
    return { success: false, error: 'internal database error' };
  }
};


const generateThumbnail2 = async function (photoBuffer) {
  try {
    // Load the photo buffer from the service

    // Create a thumbnail with lower resolution using sharp
    const thumbnailBuffer = await sharp(photoBuffer)
      .resize(600, 6 * 67) // Set the desired thumbnail dimensions
      .toBuffer();

    // Convert the thumbnail buffer to a base64-encoded string
    const thumbnailBase64 = thumbnailBuffer.toString('base64');

    // Create a new Buffer object with the Base64-encoded string
    const thumbnailBinData = Buffer.from(thumbnailBase64, 'base64');

    // Update the service object with the thumbnail field as BinData
    
    return thumbnailBinData;
  } catch (error) {
    console.log(error);
    return { success: false, error: 'Error generating thumbnail' };
  }
};

exports.editService = async function (req, username) {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const time = hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();
    console.log(req.body)
    const pages = JSON.parse(req.body.pages);

    console.log(req.file);
    const photoBuffer = fs.readFileSync(req.file.path);
    const thumbnail = await generateThumbnail2(photoBuffer);

    const existingService = await Service.findOne({ title: req.body.title });

    if (!existingService) {
      throw new Error('Service with matching title not found');
    }

    existingService.photo = photoBuffer;
    existingService.thumbnail = thumbnail;
    existingService.pages = pages;
    existingService.datePosted = formattedDate;
    existingService.timePosted = time;
    existingService.user = username;

    await existingService.save();

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

