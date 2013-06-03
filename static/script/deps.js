<div class="SystemArpTable padding">
  <ul class="nav nav-tabs">
  <% _.each(items, function(v, k) { %>
    <li>
      <a href="#arp-<%= k %>" data-toggle="tab">
      <% if("ipv4_dynamic" === k) { %>
        {{ _("IPv4 Dynamic Entries") }}
      <% } else if("ipv4_static" === k) { %>
        {{ _("IPv4 Fixed Entries") }}
      <% } else if("ipv6_dynamic" === k) { %>
        {{ _("IPv6 Neighbor Table Dynamic Entries") }}
      <% } else if("ipv6_static" === k) { %>
        {{ _("IPv6 Neighbor Table Fixed Entries") }}
      <% } %>
      </a>
    </li>
  <% }); %>
  </ul>
</div>
<div class="tab-content">
<% _.each(items, function(v, k) { %>
  <div id="arp-<%= k %>" class="tab-pane">
    <table class="table table-bordered table-hover">
      <tr>
        <th>{{ _("Interface") }}</th>
      <% if("ipv4" == v.protocol ) { %>
        <th>{{ _("IPv4 Address") }}</th>
      <% } else { %>
        <th>{{ _("IPv6 Address") }}</th>
      <% } %>
        <th>{{ _("MAC Address") }}</th>
      <% if("static" === v.type) { %>
        <td>
          <button class="btn btnArpAdd" opt="<%= k %>">{{ _("Add") }}</button>
        </td>
      <% } else { %>
        <td>
          <span>{{ _("Fix") }}</span>
        </td>
      <% } %>
      </tr>
    <% _.each(v, function(vv, kk) { %>
      <tr>
        <td><%= vv.interface %></td>
        <td><%= vv.ip %></td>
        <td><%= vv.mac %></td>
        <td>
        <% if("static" === v.type) { %>
          <button class="btn btnArpDel">{{ _("Delete") }}</button>
        <% } else { %>
          <input type="checkbox" name="<%= k %>-fix" value="fix"<% if("True" == vv.fix) { %> checked="checked"<% } %> />
        <% } %>
          <input type="hidden" name="<%= k %>-interface" value="<%= vv.interface %>" />
          <input type="hidden" name="<%= k %>-ip" value="<%= vv.ip %>" />
          <input type="hidden" name="<%= k %>-mac" value="<%= vv.mac %>" />
        </td>
      </tr>
    <% }); %>
    </table>
  </div>
<% }); %>
</div>
<div class="editSystemArpTable padding inactive form-horizontal">
  <div class="control-group">
    <label for="editArpInterface" class="control-label strong">{{ _("Interface") }}</label>
    <div class="controls">
      <select name="interface" id="editArpInterface"></select>
    </div>
  </div>
  <div class="control-group">
    <label for="editArpIp" class="control-label strong">{{ _("Ip Address") }}</label>
    <div class="controls">
      <input type="text" name="ip" id="editArpIp" placeholder="{{ _("Ip Address") }}" />
    </div>
  </div>
  <div class="control-group">
    <label for="editArpMac" class="control-label strong">{{ _("MAC Address") }}</label>
    <div class="controls">
      <input type="text" name="mac" id="editArpMac" placeholder="{{ _("MAC Address") }}" />
    </div>
  </div>
  <span class="arpBtnTpl inactive">
    <button class="btn btnArpDel">{{ _("Delete") }}</button>
  </span>
</div>