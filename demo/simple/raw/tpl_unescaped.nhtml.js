module.exports = {
  script: function (data, _content, partial) {
    function content(blockName, ctx) {
      if (ctx === undefined || ctx === null)
        ctx = data;
      return _content(blockName, ctx, content, partial)
    }
    var out = '';
    out += '<html>\n	<head>\n		<title>';
    out += data.title;
    out += '</title>\n	</head>\n	<body>\n		<p>';
    out += data.text;
    out += '</p>\n		';
    if (data.projects.length) {
      out += '\n			';
      for (var i = 0; i < data.projects.length; i++) {
        out += '\n				<a href="';
        out += data.projects[i].url;
        out += '">';
        out += data.projects[i].name;
        out += '</a>\n				<p>';
        out += data.projects[i].description;
        out += '</p>\n			'
      }
      out += '\n		'
    } else {
      out += '\n			No projects\n		'
    }
    out += '\n	</body>\n</html>';
    return out
  },
  compile: function () {
  },
  dependency: {}
}