############################################
#                                          #
#  CSCI 467      GROUP PROJECT    SEC: 01  #
#					                       #                                      
#                                          #
#    By:    Milad Jizan      Z1943173      #
#           Chris Dejong     Z1836870      #
#           Ryan Solfsburg   Z1976726      #  
#           Anita Ye         Z1950694      #
#                                          #
############################################



INSERT INTO Purchase (transaction_ID, customer_ID, bracket_ID, authorization_code, order_status, DateAndTime) VALUES
(1, 1, 1, 123456, 'Completed', '2024-04-19 08:00:00'),
(2, 2, 2, 654321, 'Pending', '2024-04-19 09:15:00'),
(3, 3, 3, NULL, 'Processing', '2024-04-19 10:30:00'),
(4, 4, 4, 987654, 'Completed', '2024-04-19 11:45:00'),
(5, 5, 5, NULL, 'Pending', '2024-04-19 12:00:00'),
(6, 6, 1, 246810, 'Processing', '2024-04-19 13:15:00'),
(7, 7, 2, 135792, 'Completed', '2024-04-19 14:30:00'),
(8, 8, 3, NULL, 'Pending', '2024-04-19 15:45:00'),
(9, 9, 4, 369258, 'Processing', '2024-04-19 16:00:00'),
(10, 10, 5, 753951, 'Completed', '2024-04-19 17:15:00');