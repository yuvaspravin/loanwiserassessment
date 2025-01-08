export const ADD_APPLICANT_NAME = "ADD_APPLICANT_NAME";

export const addApplicantName = (name) => {
  return {
    type: ADD_APPLICANT_NAME,
    payload: name,
  };
};
