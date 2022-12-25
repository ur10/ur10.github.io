git add .
git commit -m "$(curl -s http://whatthecommit.com/index.txt)"
git push origin source:source
cd _site
git add .
git commit -m "$(curl -s http://whatthecommit.com/index.txt)"
git push origin master