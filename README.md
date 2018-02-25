[![react version](https://img.shields.io/badge/React-16.2.0-green.svg?style=flat-square)](https://github.com/facebook/react/)
[![typescript version](https://img.shields.io/badge/TypeScript-2.4.1-green.svg?style=flat-square)](https://www.typescriptlang.org/)
[![materialui version](https://img.shields.io/badge/MaterialUI-1.0.0--beta.26-green.svg?style=flat-square)](https://material-ui-next.com/)

Score Board is a fun, very easy to setup, dashboard that displays stats about
players and games. Simply write the scores in a Spreadsheet and configure
this dashboard to display some stats.

**Features:**
- *Relationship Graph*: A graph showing who is playing against who.
- *Rankings*: Current rankings and how they evolved over time.
- *Activity*: Calendar showing how frequently games are played.
- *Multiple Games*: Supports showing stats about multiple games (picking
which game to display stats for)

Try it out: https://lud2k.github.io/score-board/public/index.html

## QuickStart with Google Sheets

The easiest backend to setup is Google Sheets.

1. **Make a copy of the following Google Sheet**<br />
In Google Sheets, click "File" > "Make a Copy".
https://docs.google.com/spreadsheets/d/12LokVoReDfdi2uTxX0sXiBM966u4wzs-anoEYs87gRc

2. **Publish your new Sheet**<br />
In Google Sheets, click "File" > "Publish to the web".
Select Comma-Seperated values (.csv) instead of "Web Page" for the format.

3. **Get the sheet ID, and the published ID** (they are different)<br />
The ID of the sheet is part its URL.<br />
`https://docs.google.com/spreadsheets/d/{sheetId}/edit?usp=sharing`<br />
The ID of the published sheet if also part of its URL.<br />
`https://docs.google.com/spreadsheets/d/e/{publishedId}/pub?output=csv`

4. **Fill this link**<br />
Just put the IDs in this link and you are done!
`https://lud2k.github.io/score-board/public/?config.backend.type=google-sheets-published&config.backend.publishedId={publishedId}&config.backend.sheetId={sheetId}`

## Usage

Score Board does not require any installation or server.

You can use it directly from GitHub and configure it by using query parameters.

```
https://lud2k.github.io/score-board/public/?
config.backend.type=google-sheets-published
&config.backend.publishedId={publishedId}
&config.backend.sheetId={sheetId}
```

*OR* you can also give it as a JSON string

```
https://lud2k.github.io/score-board/public/?config={json}
```

*OR* you can host your config JSON somewhere and use the `configUrl` query parameter

```
https://lud2k.github.io/score-board/public/?configUrl={http://www.somewhere.com/config.json}
```

*OR* if you decide to host the frontend on your own server, you can also just modify
index.html and set the config on window.config

```html
<script type="text/javascript">
    window.config = {config}
</script>
```

## Configuration

### Backend: Google Sheets

To use Google Sheets, you only need the ID of the sheet where you store the scores
and its published ID.
The configuration for using Google Sheets is the following:

```json
{
  "backend": {
    "type": "google-sheets-published",
    "publishedId": "{publishedId}",
    "sheetId": "{sheetId}"
  }
}
```

When using query parameters it looks like this:

```
https://lud2k.github.io/score-board/public/?
config.backend.type=google-sheets-published
&config.backend.publishedId={publishedId}
&config.backend.sheetId={sheetId}
```

### Backend: Rest API

This is the backend used by by [Score Board Server](https://github.com/lud2k/score-board-server).
A basic implementation of a Rest API backend.

```json
{
  "backend": {
    "type": "rest-api",
    "url": "http://yout.host.com/",
    "dataUrl": "optional url where a user can see the full data"
  }
}
```

### Backend: Random

This backend is just here for demo. This just generates random scores.

```json
{
  "backend": {
    "type": "random"
  }
}
```


## Host it yourself

Nothing easier. Just copy the files in `public` on your web server.


## Development

The best way to work on this project is to run `npm run dev`. This will start
a web server on the port 8080. You can then open `http://localhost:8080/` in
your favorite browser. Any change you make to the code or CSS will be built
and the browser will automagically update.

You may also run the following commands:
- `npm run build` to build the project
- `npm run lint` to lint the code


## License

This project is licensed under the terms of the [MIT license](https://github.com/lud2k/score-board/blob/master/LICENSE).
