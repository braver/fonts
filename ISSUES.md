## Known issues and disclaimer

**Problem**  
@font-face fonts [are not always loaded in time](https://github.com/atom/atom/issues/4200) for the measurements that control cursor and selection placement.  Also, sometimes, [switching fonts](https://github.com/atom/atom/issues/3201) causes the cursor and selection to misalign. Not with all fonts, not all the time. Beta software...  
**Solution**  
A function is called for a number of events, which corrects the measurements in most situations. However, bold and italic fonts may still be measured incorrectly. If that occurs switching tabs increasing and then decreasing font-sizes will solve the problem.

**Disclaimer**  
I've tried to check everything re: licenses and have not included fonts where I think the license does not allow it. If any font is included but shouldn't be, let me know and I'll take it out.
