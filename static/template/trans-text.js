function Translation(str) {
    trans = {
        "OK": "{{ _("OK")}}",
        "Cancel": "{{ _("Cancel")}}",
        "Next": "{{ _("Next") }}",
        "Back": "{{ _("Back") }}",
        "Done": "{{ _("Done") }}",
        "Uploading...": "{{ _("Uploading...") }}"
    }

    if(str in trans) {
        return trans[str];
    } else {
        return str;
    }
};
