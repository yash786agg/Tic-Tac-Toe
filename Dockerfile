FROM python:3.7-alpine3.10

COPY . /opt/assignment

WORKDIR /opt/assignment

RUN pip3 install -r requirements.txt
RUN pip3 install flask-cors  # Add this line to install flask-cors

EXPOSE 5000

CMD python3 server.py
