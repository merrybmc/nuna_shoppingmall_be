import dotenv from 'dotenv';
dotenv.config();

const options = {
  httpOnly: true,
  sameSite: 'none',
  secure: 'true',
};

const REDIRECT_CALLBACK_URL = process.env.REDIRECT_CALLBACK_URL;

const intercepter = async (req, res) => {
  const { data, error } = req;

  if (req.statusCode === 200 && req.token && req.social === true) {
    res.status(200).cookie('token', req.token, options);
    return res.redirect(REDIRECT_CALLBACK_URL);
  } else if (req.statusCode === 200 && req.token)
    res.status(200).cookie('token', req.token, options).json({ status: 'success', data });
  else if (req.statusCode === 200) res.status(200).json({ status: 'success', data });
  else if (req.statusCode === 400) res.status(400).json({ status: 'fail', error });
};

export default intercepter;
