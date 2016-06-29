exports.createWorkExperience = (con, data, next) => {
  con.query('INSERT INTO WORK_EXPERIENCE SET ?', data, next);
};

// exports.updateWorkExperience = (con, data, next) => {
//   con.query('UDPATE USER SET ? WHERE EMAIL = ?', [data, email], next);
// };
