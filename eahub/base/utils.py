import csv

from django.http import HttpResponse

from ..profiles import models


def user_display(user):
    try:
        profile = user.profile
    except models.Profile.DoesNotExist:
        return user.email
    return profile.name


class ExportCsvMixin:
    def export_csv(self, request, queryset, field_names, filename):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename={}.csv".format(filename)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            writer.writerow(obj.convert_to_row(field_names))

        return response

    export_csv.short_description = "Export as CSV"
