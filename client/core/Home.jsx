import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core'

import remoteMedicalCareJpg from './../assets/images/sarah-kilian-GhtVhowMQvo-unsplash.jpg'

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(
      2.5
    )}px
   ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  credit: {
    padding: 10,
    textAlign: 'right',
    backgroundColor: '#ededed',
    borderBottom: '1px solid #d0d0d0',
    '& a': {
      color: '#3f4771',
    },
  },
}))

const Home = () => {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <Typography
        variant="h6"
        className={classes.title}
      >
        Home Page
      </Typography>
      {/* <img src={`${remoteMedicalCareJpg}`} /> */}
      <CardMedia
        className={classes.media}
        image={remoteMedicalCareJpg}
        title="Unicorn Bicycle"
      />
      <Typography
        variant="body2"
        component="p"
        className={classes.credit}
        color="textSecondary"
      >
        Photo by{' '}
        <a
          href="https://unsplash.com/@rojekilian"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sarah Kilian
        </a>{' '}
        on Unsplash
      </Typography>
      <CardContent>
        <Typography variant="body2" component="p">
          Welcome to the meeDoctors home page.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Home
