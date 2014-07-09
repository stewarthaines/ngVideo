(function($angular, $math) {

    "use strict";

    /**
     * @property requiredProperties
     * @type {String[]}
     */
    var requiredProperties = ['duration', 'currentTime'];

    $angular.module('ngVideo').directive('viFeedback', ['ngVideoOptions',

    function ngVideoDirectiveScreen(ngVideoOptions) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: ngVideoOptions.RESTRICT,

            /**
             * @property controller
             * @type {Function}
             * @param $scope {Object}
             */
            controller: ['$scope', '$interval', '$window', 'ngVideoOptions',

            function controller($scope, $interval, $window, ngVideoOptions) {

                /**
                 * @property duration
                 * @type {Number}
                 */
                $scope.duration = 0;

                /**
                 * @property lastUpdate
                 * @type {Number}
                 */
                $scope.lastUpdate = 0;

                /**
                 * @property currentTime
                 * @type {Number}
                 */
                $scope.currentTime = 0;

                /**
                 * @property buffered
                 * @type {Number}
                 */
                $scope.buffered = 0;

                /**
                 * @property interval
                 * @type {Object}
                 */
                $scope.interval = {};

                /**
                 * @method grabStatistics
                 * @return {void}
                 */
                $scope.grabStatistics = function grabStatistics() {

                    var player = $scope.player;

                    // Iterate over each property we wish to listen to.
                    $angular.forEach(requiredProperties, function forEach(property) {
                        $scope[property] = $scope.player[property] || $scope[property];
                    });

                    if ($scope.player.buffered.length !== 0) {

                        // Update the buffered amount.
                        $scope.buffered = $math.round(player.buffered.end(0) / player.duration) * 100;

                    }

                    // Notify everybody that the statistics have been updated!
                    $scope.lastUpdate = new $window.Date().getTime();

                };

                /**
                 * @method beginPolling
                 * @return {void}
                 */
                $scope.beginPolling = function beginPolling() {

                    // Update the statistics every so often.
                    $scope.interval = $interval($scope.grabStatistics, ngVideoOptions.REFRESH);

                };

                /**
                 * @method endPolling
                 * @return {void}
                 */
                $scope.endPolling = function endPolling() {
                    $interval.cancel($scope.interval);
                };

                // Monitor the status of the video player.
                $scope.$watch('playing', function isPlaying(playing) {

                    // Update the statistics once.
                    $scope.grabStatistics();

                    if (playing) {

                        // Update the statistics periodically.
                        $scope.beginPolling();
                        return;

                    }

                    $scope.endPolling();

                });

            }]

        }

    }]);

})(window.angular, window.Math);