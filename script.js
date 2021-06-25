const url = require('url').format({
  protocol: 'file',
  slashes: true,
  pathname: require('path').join(__dirname, 'index.html')
});

const {app, BrowserWindow} = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 850
  });

  win.loadURL(url);
  win.on('closed', function(){
    win = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function() {
  app.quit();
})
