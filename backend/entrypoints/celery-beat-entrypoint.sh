#!/bin/bash
# an empty 'pidfile' argument is for disabling celery in creating .pid which can sometimes fail a container from restarting
celery -A backend beat -l info -S django --pidfile=
