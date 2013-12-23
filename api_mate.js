// Generated by CoffeeScript 1.6.3
(function() {
  var ApiMate, isFilled, pad, postErrorTemplate, postSuccessTemplate, preUploadUrl, resultsTemplate;

  resultsTemplate = "<div class='result-set'>     <div class='result-title'>       <h5 class='label-title'>Results {{title}}:</h5>     </div>     <div class='result-links'>       {{#urls}}         <div class='result-link-wrapper'>         <div class='result-link {{urlClass}}'>           <a href='#' data-url='{{url}}' class='api-link-post tooltipped label' title='Send \"{{name}}\" using a POST request' data-api-method='{{name}}', >             post           </a>           <span class='method-name'>{{description}}</span>           <a class='api-link' href='{{url}}'>{{url}}</a>         </div>         </div>       {{/urls}}     </div>   </div>";

  postSuccessTemplate = "<pre>{{response}}</pre>";

  postErrorTemplate = "<p>Server responded with status: <code>{{status}}: {{statusText}}</code>.</p>   {{#response}}     <p>Content:</p>     <pre>{{response}}</pre>   {{/response}}   {{^response}}     <p>Content: <code>-- no content --</code></p>   {{/response}}   <p>If you don't know the reason for this error, check these possibilities:</p>   <ul>     <li>       Your server does not allow <strong>cross-domain requests</strong>. By default BigBlueButton and Mconf-Live <strong>do not</strong> allow cross-domain       requests, so you have to enable it to test this request via POST. Check our <a href=\"https://github.com/mconf/api-mate/tree/master#allow-cross-domain-requests-for-post-requests\">README</a>       for instructions on how to do it.     </li>     <li>       This API method cannot be accessed via POST.     </li>     <li>       Your server is down or malfunctioning. Log into it and check if everything is OK with <code>bbb-conf --check</code>.     </li>   <ul>";

  preUploadUrl = "<?xml version='1.0' encoding='UTF-8'?>     <modules>       <module name='presentation'>         {{#urls}}           <document url='{{url}}' />         {{/urls}}       </module>     </modules>";

  ApiMate = (function() {
    function ApiMate() {
      this.updatedTimer = null;
    }

    ApiMate.prototype.configure = function() {
      var _this = this;
      this.setInitialValues();
      $("#input-id").on("keyup", function() {
        return $("#input-name").val($(this).val());
      });
      $("input, select, textarea", "#config-fields").on("change keyup", function(e) {
        return _this.generateUrls();
      });
      $("input, select, textarea", "#config-server").on("change keyup", function(e) {
        return _this.generateUrls();
      });
      $("#view-type-input").on("click", function() {
        var selected;
        selected = !$("#view-type-input").hasClass("active");
        return _this.expandLinks(selected);
      });
      $(".api-mate-clearall").on("click", function(e) {
        _this.clearAllFields();
        return _this.generateUrls();
      });
      this.generateUrls();
      this.bindPostRequests();
      return this.bindTooltips();
    };

    ApiMate.prototype.setInitialValues = function() {
      var name, user, vbridge;
      vbridge = "7" + pad(Math.floor(Math.random() * 10000 - 1).toString(), 4);
      $("#input-voice-bridge").val(vbridge);
      name = "random-" + Math.floor(Math.random() * 10000000).toString();
      $("#input-name").val(name);
      $("#input-id").val(name);
      user = "User " + Math.floor(Math.random() * 10000000).toString();
      return $("#input-fullname").val(user);
    };

    ApiMate.prototype.addUrlsToPage = function(urls) {
      var desc, html, item, opts, placeholder, _i, _len;
      placeholder = $("#api-mate-results");
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        item = urls[_i];
        desc = item.description;
        if (desc.match(/recordings/i)) {
          item.urlClass = "url-recordings";
        } else if (desc.match(/from mobile/i)) {
          item.urlClass = "url-from-mobile";
        } else if (desc.match(/mobile:/i)) {
          item.urlClass = "url-mobile-api";
        } else if (desc.match(/custom call/i)) {
          item.urlClass = "url-custom-call";
        } else {
          item.urlClass = "url-standard";
        }
      }
      opts = {
        title: new Date().toTimeString(),
        urls: urls
      };
      html = Mustache.to_html(resultsTemplate, opts);
      $(placeholder).html(html);
      this.expandLinks($("#view-type-input").hasClass("active"));
      this.bindTooltips();
      placeholder.addClass("updated");
      clearTimeout(this.updatedTimer);
      return this.updatedTimer = setTimeout(function() {
        return placeholder.removeClass("updated");
      }, 300);
    };

    ApiMate.prototype.getApi = function() {
      var server;
      server = {};
      server.url = $("#input-custom-server-url").val();
      server.salt = $("#input-custom-server-salt").val();
      server.mobileSalt = $("#input-custom-server-mobile-salt").val();
      server.url = server.url.replace(/(\/api)?\/?$/, '/api');
      server.name = server.url;
      return new BigBlueButtonApi(server.url, server.salt, server.mobileSalt);
    };

    ApiMate.prototype.generateUrls = function() {
      var api, customCalls, line, lines, paramName, paramValue, params, separator, urls, _i, _j, _len, _len1;
      params = {};
      if (isFilled("#input-name")) {
        params.name = $("#input-name").val();
      }
      if (isFilled("#input-id")) {
        params.meetingID = $("#input-id").val();
      }
      if (isFilled("#input-moderator-password")) {
        params.moderatorPW = $("#input-moderator-password").val();
      }
      if (isFilled("#input-attendee-password")) {
        params.attendeePW = $("#input-attendee-password").val();
      }
      if (isFilled("#input-welcome")) {
        params.welcome = $("#input-welcome").val();
      }
      if (isFilled("#input-voice-bridge")) {
        params.voiceBridge = $("#input-voice-bridge").val();
      }
      if (isFilled("#input-dial-number")) {
        params.dialNumber = $("#input-dial-number").val();
      }
      if (isFilled("#input-web-voice")) {
        params.webVoice = $("#input-web-voice").val();
      }
      if (isFilled("#input-logout-url")) {
        params.logoutURL = $("#input-logout-url").val();
      }
      if (isFilled("#input-max-participants")) {
        params.maxParticipants = $("#input-max-participants").val();
      }
      if (isFilled("#input-duration")) {
        params.duration = $("#input-duration").val();
      }
      params.record = $("#input-record").is(":checked");
      if (isFilled("#input-fullname")) {
        params.fullName = $("#input-fullname").val();
      }
      if (isFilled("#input-user-id")) {
        params.userID = $("#input-user-id").val();
      }
      if (isFilled("#input-create-time")) {
        params.createTime = $("#input-create-time").val();
      }
      if (isFilled("#input-web-voice-conf")) {
        params.webVoiceConf = $("#input-web-voice-conf").val();
      }
      if (isFilled("#input-id")) {
        params.recordID = $("#input-id").val();
      }
      params.publish = $("#input-publish").is(":checked");
      if (isFilled("#input-redirect-client")) {
        params.redirectClient = $("#input-redirect-client").val();
      }
      if (isFilled("#input-client-url")) {
        params.clientURL = $("#input-client-url").val();
      }
      if (isFilled("#input-config-token")) {
        params.configToken = $("#input-config-token").val();
      }
      if (isFilled("#input-avatar-url")) {
        params.avatarURL = $("#input-avatar-url").val();
      }
      if (isFilled("#input-meta")) {
        lines = $("#input-meta").val().replace(/\r\n/g, "\n").split("\n");
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          separator = line.indexOf("=");
          if (separator >= 0) {
            paramName = line.substring(0, separator);
            paramValue = line.substring(separator + 1, line.length);
            params["meta_" + paramName] = paramValue;
          }
        }
      }
      if (isFilled("#input-custom")) {
        lines = $("#input-custom").val().replace(/\r\n/g, "\n").split("\n");
        for (_j = 0, _len1 = lines.length; _j < _len1; _j++) {
          line = lines[_j];
          separator = line.indexOf("=");
          if (separator >= 0) {
            paramName = line.substring(0, separator);
            paramValue = line.substring(separator + 1, line.length);
            params["custom_" + paramName] = paramValue;
          }
        }
      }
      customCalls = null;
      if (isFilled("#input-custom-calls")) {
        lines = $("#input-custom-calls").val().replace(/\r\n/g, "\n").split("\n");
        customCalls = lines;
      }
      params.configXML = $("#input-config-xml").val();
      api = this.getApi();
      urls = api.getUrls(params, customCalls);
      return this.addUrlsToPage(urls);
    };

    ApiMate.prototype.clearAllFields = function() {
      $("#config-fields input, #config-fields textarea").each(function() {
        return $(this).val("");
      });
      return $("#config-fields input[type=checkbox]").each(function() {
        return $(this).attr("checked", null);
      });
    };

    ApiMate.prototype.expandLinks = function(selected) {
      if (selected) {
        return $("#api-mate-results .result-link").addClass('expanded');
      } else {
        return $("#api-mate-results .result-link").removeClass('expanded');
      }
    };

    ApiMate.prototype.bindPostRequests = function() {
      var _apiMate;
      _apiMate = this;
      return $(document).on('click', 'a.api-link-post', function(e) {
        var $target, data, href, method;
        $target = $(this);
        href = $target.attr('data-url');
        method = $target.attr('data-api-method');
        data = _apiMate.getPostData(method);
        $('.api-link-post').addClass('disabled');
        $.ajax({
          url: href,
          type: "POST",
          crossDomain: true,
          contentType: "application/xml; charset=utf-8",
          dataType: "xml",
          data: data,
          complete: function(jqxhr, status) {
            var html, opts;
            if (jqxhr.status === 200) {
              $('#post-response-modal .modal-header').removeClass('alert-danger');
              $('#post-response-modal .modal-header').addClass('alert-success');
              html = Mustache.to_html(postSuccessTemplate, {
                response: jqxhr.responseText
              });
              $('#post-response-modal .modal-body').html(html);
            } else {
              $('#post-response-modal .modal-header h4').text('Ooops!');
              $('#post-response-modal .modal-header').addClass('alert-danger');
              $('#post-response-modal .modal-header').removeClass('alert-success');
              opts = {
                status: jqxhr.status,
                statusText: jqxhr.statusText
              };
              if (!_.isEmpty(jqxhr.responseText)) {
                opts['response'] = jqxhr.responseText;
              }
              html = Mustache.to_html(postErrorTemplate, opts);
              $('#post-response-modal .modal-body').html(html);
            }
            $('#post-response-modal').modal({
              show: true
            });
            return $('.api-link-post').removeClass('disabled');
          }
        });
        e.preventDefault();
        return false;
      });
    };

    ApiMate.prototype.bindTooltips = function() {
      var defaultOptions;
      defaultOptions = {
        container: 'body',
        placement: 'top'
      };
      return $('.tooltipped').tooltip(defaultOptions);
    };

    ApiMate.prototype.getPostData = function(method) {
      var opts, urls;
      if (method === 'create') {
        if (isFilled("#input-pre-upload-url")) {
          urls = $("#input-pre-upload-url").val().replace(/\r\n/g, "\n").split("\n");
          urls = _.map(urls, function(u) {
            return {
              url: u
            };
          });
        }
        if (urls != null) {
          opts = {
            urls: urls
          };
          return Mustache.to_html(preUploadUrl, opts);
        }
      } else if (method === 'setConfigXML') {
        return null;
      }
    };

    return ApiMate;

  })();

  isFilled = function(field) {
    var value;
    value = $(field).val();
    return (value != null) && !_.isEmpty(value.trim());
  };

  pad = function(num, size) {
    var s, _i, _ref;
    s = '';
    for (_i = 0, _ref = size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--) {
      s += '0';
    }
    s += num;
    return s.substr(s.length - size);
  };

  $(function() {
    var apiMate;
    apiMate = new ApiMate();
    return apiMate.configure();
  });

}).call(this);
